import { Pipe, PipeTransform } from '@angular/core';
import { Config } from "../../shared/config/env.config";
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'imageShow'})
export class ImageShowPipe implements PipeTransform {
  transform(id: number, width: number, height: number): string {
    return Config.OSS_IMAGE_URL
              + `${id}/resize_${width}_${height}/mode_fill`;
  }
}
