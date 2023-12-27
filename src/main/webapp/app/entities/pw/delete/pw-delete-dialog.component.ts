import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPW } from '../pw.model';
import { PWService } from '../service/pw.service';

@Component({
  standalone: true,
  templateUrl: './pw-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PWDeleteDialogComponent {
  pW?: IPW;

  constructor(
    protected pWService: PWService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pWService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
