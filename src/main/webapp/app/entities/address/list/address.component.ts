import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAddress } from '../address.model';
import { AddressService } from '../service/address.service';
import { AddressDeleteDialogComponent } from '../delete/address-delete-dialog.component';

@Component({
  selector: 'jhi-address',
  templateUrl: './address.component.html',
})
export class AddressComponent implements OnInit {
  addresses?: IAddress[];
  isLoading = false;

  constructor(protected addressService: AddressService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.addressService.query().subscribe(
      (res: HttpResponse<IAddress[]>) => {
        this.isLoading = false;
        this.addresses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAddress): string {
    return item.id!;
  }

  delete(address: IAddress): void {
    const modalRef = this.modalService.open(AddressDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.address = address;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
