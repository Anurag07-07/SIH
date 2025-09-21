declare module "exif-parser" {
  interface ExifTags {
    // Date/time info
    DateTimeOriginal?: number; // when photo was taken
    CreateDate?: number;       // file creation date
    ModifyDate?: number;       // last modification date

    // Camera info
    Make?: string;             // camera manufacturer
    Model?: string;            // camera model
    LensModel?: string;        // lens model
    Software?: string;         // software used

    // Image details
    Orientation?: number;      // orientation (1 = normal)
    ExposureTime?: number;     // shutter speed
    FNumber?: number;          // aperture
    ISO?: number;              // ISO sensitivity
    FocalLength?: number;      // focal length
    Flash?: number;            // flash fired or not

    // GPS (if present)
    GPSLatitude?: number;
    GPSLongitude?: number;
    GPSAltitude?: number;
    GPSTimeStamp?: number;
    GPSDateStamp?: string;

    [key: string]: any; // fallback for unlisted tags
  }

  interface ExifData {
    tags: ExifTags;
    thumbnail?: Buffer;
    imageSize?: { height: number; width: number };
  }

  interface ExifParser {
    parse: () => ExifData;
  }

  export function create(buffer: Buffer): ExifParser;
}
