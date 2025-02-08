// types.ts
export interface MetadataLocation {
    latitude: number;
    longitude: number;
  }
  
  export interface ImageMetadata {
    dateTime?: string;
    location?: MetadataLocation;
    orientation?: number;
    make?: string;
    model?: string;
  }
  
  // Different reader classes for different formats
  abstract class BaseMetadataReader {
    protected view: DataView;
  
    constructor(arrayBuffer: ArrayBuffer) {
      this.view = new DataView(arrayBuffer);
    }
  
    protected isOffsetValid(offset: number, size: number = 1): boolean {
      return offset >= 0 && offset + size <= this.view.byteLength;
    }
  
    abstract read(): Promise<ImageMetadata | null>;
  }
  
  // JPEG EXIF Reader
  class JpegReader extends BaseMetadataReader {
    private tiffOffset: number = 0;
    private littleEndian: boolean = false;
  
    private getStringFromDataView(offset: number, length: number): string {
      if (!this.isOffsetValid(offset, length)) {
        throw new Error(`Invalid offset or length for string reading: offset=${offset}, length=${length}`);
      }
      
      let str = '';
      for (let i = 0; i < length; i++) {
        str += String.fromCharCode(this.view.getUint8(offset + i));
      }
      return str.replace(/\0+$/, '');
    }
  
    private readTags(dirStart: number): Record<number, { type: number; count: number; valueOffset: number }> {
      if (!this.isOffsetValid(dirStart, 2)) {
        throw new Error(`Invalid directory start offset: ${dirStart}`);
      }
  
      const entries = this.view.getUint16(dirStart, this.littleEndian);
      const tags: Record<number, { type: number; count: number; valueOffset: number }> = {};
  
      if (!this.isOffsetValid(dirStart + 2 + (entries * 12))) {
        throw new Error(`Not enough space for ${entries} entries`);
      }
  
      for (let i = 0; i < entries; i++) {
        const entryOffset = dirStart + 2 + (i * 12);
        const tag = this.view.getUint16(entryOffset, this.littleEndian);
        
        const valueOffset = this.view.getUint32(entryOffset + 8, this.littleEndian);
        const count = this.view.getUint32(entryOffset + 4, this.littleEndian);
  
        if (count > 10000 || valueOffset > this.view.byteLength) {
          continue;
        }
  
        tags[tag] = {
          type: this.view.getUint16(entryOffset + 2, this.littleEndian),
          count,
          valueOffset,
        };
      }
  
      return tags;
    }
  
    async read(): Promise<ImageMetadata | null> {
      try {
        if (!this.isOffsetValid(0, 2) || this.view.getUint16(0) !== 0xFFD8) {
          return null;
        }
  
        let offset = 0;
        const metadata: ImageMetadata = {};
  
        while (offset < this.view.byteLength - 1) {
          if (!this.isOffsetValid(offset, 4)) break;
  
          const marker = this.view.getUint16(offset);
          if (marker === 0xFFE1) {
            const length = this.view.getUint16(offset + 2);
            
            if (!this.isOffsetValid(offset + 4, 4)) break;
  
            const exifStr = this.getStringFromDataView(offset + 4, 4);
            if (exifStr !== 'Exif') {
              offset += 2;
              continue;
            }
  
            this.tiffOffset = offset + 10;
            
            if (!this.isOffsetValid(this.tiffOffset, 8)) break;
  
            this.littleEndian = this.view.getUint16(this.tiffOffset) === 0x4949;
  
            if (this.view.getUint16(this.tiffOffset + 2, this.littleEndian) !== 0x002A) {
              offset += 2;
              continue;
            }
  
            const firstIFDOffset = this.view.getUint32(this.tiffOffset + 4, this.littleEndian);
            
            if (!this.isOffsetValid(this.tiffOffset + firstIFDOffset)) break;
  
            const tags = this.readTags(this.tiffOffset + firstIFDOffset);
  
            if (tags[0x0132]) {
              const dateTimeOffset = this.tiffOffset + tags[0x0132].valueOffset;
              if (this.isOffsetValid(dateTimeOffset, 19)) {
                metadata.dateTime = this.getStringFromDataView(dateTimeOffset, 19);
              }
            }
  
            if (tags[0x0112]) {
              const orientationOffset = this.tiffOffset + tags[0x0112].valueOffset;
              if (this.isOffsetValid(orientationOffset, 2)) {
                metadata.orientation = this.view.getUint16(orientationOffset, this.littleEndian);
              }
            }
  
            if (tags[0x010F]) {
              const makeOffset = this.tiffOffset + tags[0x010F].valueOffset;
              if (this.isOffsetValid(makeOffset, tags[0x010F].count)) {
                metadata.make = this.getStringFromDataView(makeOffset, tags[0x010F].count - 1);
              }
            }
  
            if (tags[0x0110]) {
              const modelOffset = this.tiffOffset + tags[0x0110].valueOffset;
              if (this.isOffsetValid(modelOffset, tags[0x0110].count)) {
                metadata.model = this.getStringFromDataView(modelOffset, tags[0x0110].count - 1);
              }
            }
  
            break;
          }
          offset += 1;
        }
  
        return Object.keys(metadata).length > 0 ? metadata : null;
      } catch (error) {
        console.error('Error reading JPEG metadata:', error);
        return null;
      }
    }
  }
  
  // TIFF Reader
  class TiffReader extends BaseMetadataReader {
    private littleEndian: boolean = false;
  
    async read(): Promise<ImageMetadata | null> {
      try {
        if (!this.isOffsetValid(0, 4)) return null;
  
        // Check TIFF header (II or MM)
        this.littleEndian = this.view.getUint16(0) === 0x4949;
        
        // Check TIFF magic number (42)
        if (this.view.getUint16(2, this.littleEndian) !== 0x002A) {
          return null;
        }
  
        const metadata: ImageMetadata = {};
        const ifdOffset = this.view.getUint32(4, this.littleEndian);
        
        if (!this.isOffsetValid(ifdOffset)) return null;
  
        // Read IFD entries (similar to JPEG EXIF reading)
        // This is a simplified version - you would want to add more complete TIFF parsing
        const numEntries = this.view.getUint16(ifdOffset, this.littleEndian);
        
        // Basic sanity check
        if (numEntries > 1000) return null;
  
        return metadata;
      } catch (error) {
        console.error('Error reading TIFF metadata:', error);
        return null;
      }
    }
  }
  
  // PNG Reader (unchanged)
  class PngReader extends BaseMetadataReader {
    private async readTextChunks(): Promise<ImageMetadata> {
      const metadata: ImageMetadata = {};
      let offset = 8; // Skip PNG signature
  
      while (offset < this.view.byteLength) {
        if (!this.isOffsetValid(offset, 8)) break;
  
        const length = this.view.getUint32(offset);
        const type = this.getChunkType(offset + 4);
        
        if (type === 'tEXt' || type === 'iTXt') {
          const textData = this.extractTextChunk(offset + 8, length);
          this.parseTextMetadata(textData, metadata);
        }
  
        offset += 8 + length + 4; // Length + Type + Data + CRC
      }
  
      return metadata;
    }
  
    private getChunkType(offset: number): string {
      if (!this.isOffsetValid(offset, 4)) return '';
      
      return Array.from({ length: 4 }, (_, i) => 
        String.fromCharCode(this.view.getUint8(offset + i))
      ).join('');
    }
  
    private extractTextChunk(offset: number, length: number): string {
      if (!this.isOffsetValid(offset, length)) return '';
      
      return Array.from({ length }, (_, i) =>
        String.fromCharCode(this.view.getUint8(offset + i))
      ).join('');
    }
  
    private parseTextMetadata(text: string, metadata: ImageMetadata): void {
      const [keyword, value] = text.split('\0');
      if (!keyword || !value) return;
      
      switch (keyword.toLowerCase()) {
        case 'create_date':
        case 'datetime':
          metadata.dateTime = value;
          break;
        case 'make':
          metadata.make = value;
          break;
        case 'model':
          metadata.model = value;
          break;
        case 'orientation':
          const orientationValue = parseInt(value);
          if (!isNaN(orientationValue)) {
            metadata.orientation = orientationValue;
          }
          break;
      }
    }
  
    async read(): Promise<ImageMetadata | null> {
      try {
        // Check PNG signature
        const signature = [137, 80, 78, 71, 13, 10, 26, 10];
        
        if (!this.isOffsetValid(0, signature.length)) {
          return null;
        }
  
        const isValidPNG = signature.every((byte, i) => 
          this.view.getUint8(i) === byte
        );
  
        if (!isValidPNG) {
          return null;
        }
  
        const metadata = await this.readTextChunks();
        return Object.keys(metadata).length > 0 ? metadata : null;
        
      } catch (error) {
        console.error('Error reading PNG metadata:', error);
        return null;
      }
    }
  }
  
  // Main metadata extraction service
  export const extractExifDataCustom = async (file: File): Promise<ImageMetadata | null> => {
    if (!file.type.startsWith('image/')) return null;
  
    return new Promise((resolve) => {
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        if (!e.target?.result || typeof e.target.result === 'string') {
          resolve(null);
          return;
        }
  
        let metadataReader: BaseMetadataReader;
  
        switch (file.type.toLowerCase()) {
          case 'image/jpeg':
          case 'image/jpg':
            metadataReader = new JpegReader(e.target.result);
            break;
          case 'image/png':
            metadataReader = new PngReader(e.target.result);
            break;
          case 'image/tiff':
            metadataReader = new TiffReader(e.target.result);
            break;
          default:
            resolve(null);
            return;
        }
  
        const metadata = await metadataReader.read();
        resolve(metadata);
      };
  
      reader.readAsArrayBuffer(file);
    });
  };