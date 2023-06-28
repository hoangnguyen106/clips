import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();
  isSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Updating clip.';

  clipID = new FormControl('');
  title = new FormControl(
    '',
    [Validators.required, Validators.minLength(3)]
    // nonNullable: true
  );

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return;
    }

    this.isSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  async submit() {
    if (!this.activeClip) {
      return;
    }

    this.isSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip.';

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (e) {
      this.isSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.isSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }
}
