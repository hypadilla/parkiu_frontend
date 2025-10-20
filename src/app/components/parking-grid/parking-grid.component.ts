import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ParkingSpace } from '../../models/parking.model';

@Component({
  selector: 'app-parking-grid',
  templateUrl: './parking-grid.component.html',
  styleUrls: ['./parking-grid.component.scss']
})
export class ParkingGridComponent {
  @Input() parkingSpaces: ParkingSpace[] = [];
  @Output() spaceClicked = new EventEmitter<ParkingSpace>();

  // Divide los parqueaderos en grupos de 18
  get groupedSpaces(): ParkingSpace[][] {
    const groups: ParkingSpace[][] = [];
    for (let i = 0; i < this.parkingSpaces.length; i += 18) {
      groups.push(this.parkingSpaces.slice(i, i + 18));
    }
    return groups;
  }

  // Obtiene las últimas 7 celdas para el layout especial
  get lastSevenSpaces(): ParkingSpace[] {
    if (this.parkingSpaces.length >= 7) {
      return this.parkingSpaces.slice(-7);
    }
    return [];
  }

  // Obtiene las primeras 3 de las últimas 7
  get lastSevenFirstThree(): ParkingSpace[] {
    if (this.lastSevenSpaces.length >= 3) {
      return this.lastSevenSpaces.slice(0, 3);
    }
    return [];
  }

  // Obtiene las últimas 4 de las últimas 7
  get lastSevenLastFour(): ParkingSpace[] {
    if (this.lastSevenSpaces.length >= 7) {
      return this.lastSevenSpaces.slice(3, 7);
    }
    return [];
  }

  // Obtiene los espacios sin las últimas 7 celdas
  get spacesWithoutLastSeven(): ParkingSpace[] {
    if (this.parkingSpaces.length >= 7) {
      return this.parkingSpaces.slice(0, -7);
    }
    return this.parkingSpaces;
  }

  onSpaceClick(space: ParkingSpace): void {
    this.spaceClicked.emit(space);
  }
}



