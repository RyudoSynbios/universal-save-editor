import FileSaver from 'file-saver';
import moment from 'moment';

class HexEditor {
  constructor(file, callback) {
    this.fileName = file.name;
    this.fileReader = new FileReader();

    this.fileReader.onload = function onload() {
      this.dataView = new DataView(this.result);
      callback();
    };
    this.fileReader.readAsArrayBuffer(file);
  }

  readByte(offset, octets, type) {
    if (Array.isArray(offset)) {
      let value = '';
      for (let i = 0; i < offset[1]; i += 1) {
        value += this.readByte(offset[0] + i, octets, type);
      }
      return value;
    }

    let value;
    switch (octets) {
      case 8:
        value = this.fileReader.dataView.getUint8(offset);
        break;
      case 16:
        value = this.fileReader.dataView.getUint16(offset, true);
        break;
      case 32:
        value = this.fileReader.dataView.getUint32(offset, true);
        break;
      default:
        return null;
    }

    if (type === 'time') {
      value /= 60;
      value *= 1000;
      value = moment.duration(value);
      value = moment(value._data).format('HH:mm:ss');
    }

    return value;
  }

  writeByte(offset, value, octets, type) {
    // if (Array.isArray(offset)) {
    //   let value = '';
    //   for (let i = 0; i < offset[1]; i += 1) {
    //     value += this.readByte(offset[0] + i, octets);
    //   }
    //   return value;
    // }

    if (type === 'time') {
      value = moment.duration(value);
      value /= 1000;
      value *= 60;
    }

    switch (octets) {
      case 8:
        return this.fileReader.dataView.setUint8(offset, value);
      case 16:
        return this.fileReader.dataView.setUint16(offset, value, true);
      case 32:
        return this.fileReader.dataView.setUint32(offset, value, true);
      default:
        return null;
    }
  }

  save() {
    const blob = new Blob([this.fileReader.dataView.buffer]);
    FileSaver.saveAs(blob, this.fileName);
  }
}

export default HexEditor;
