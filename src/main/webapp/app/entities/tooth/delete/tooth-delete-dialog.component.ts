import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITooth } from '../tooth.model';
import { ToothService } from '../service/tooth.service';

@Component({
  standalone: true,
  templateUrl: './tooth-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ToothDeleteDialogComponent {
  tooth?: ITooth;

  constructor(
    protected toothService: ToothService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.toothService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
