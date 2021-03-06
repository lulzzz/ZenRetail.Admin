﻿import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { SessionService } from './../services/session.service';
import { AttributeService } from './../services/attribute.service';
import { Attribute, AttributeValue, Media } from './../shared/models';

@Component({
    selector: 'app-attributevalue',
    templateUrl: 'attributevalue.component.html'
})

export class AttributeValueComponent implements OnInit {
    totalValues = 0;
    selectedValue: AttributeValue;
    dataformValue: FormGroup;
    cols: any[];

    constructor(private messageService: MessageService,
                private translate: TranslateService,
                private sessionService: SessionService,
                private attributeService: AttributeService,
                private confirmationService: ConfirmationService,
                private fb: FormBuilder) {
        this.cols = [
            { field: 'attributeValueId', header: 'Id' },
            { field: 'attributeValueCode', header: 'Code' },
            { field: 'attributeValueName', header: 'Name' }
        ];  
    }

    get selected(): Attribute { return this.attributeService.selected; }
    set values(value) { this.attributeService.values = value; }
    get values(): AttributeValue[] { return this.attributeService.values; }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Attribute values');

        this.dataformValue = this.fb.group({
            'code': new FormControl('', [Validators.required, Validators.maxLength(6)]),
            'name': new FormControl('', Validators.required)
        });

        if (!this.selected) {
            return;
        }

        this.attributeService
            .getValueByAttributeId(this.selected.attributeId)
            .subscribe(result => {
                this.values = result;
                this.totalValues = this.values.length;
            }
        );
    }

    get isNewValue(): boolean { return this.selectedValue == null || this.selectedValue.attributeValueId === 0; }

    get selectedValueIndex(): number { return this.values.indexOf(this.selectedValue); }

    addValueClick() {
        if (this.selected && this.selected.attributeId > 0) {
            this.selectedValue = new AttributeValue(this.selected.attributeId);
        } else {
            this.translate.get('Select a attribute before add value!')
                .subscribe((res: string) => this.messageService.add({severity: 'warning', summary: '', detail: res }));
        }
    }

    onRowSelect(event: any) {
        if (!this.selectedValue.media) {
            this.selectedValue.media = new Media();
        }
    }

    closeValueClick() {
        this.selectedValue = null;
    }

    saveValueClick() {
        if (this.selectedValue.media.name === '') {
            this.selectedValue.media = null;
        }
        if (this.isNewValue) {
            this.attributeService
                .createValue(this.selectedValue)
                .subscribe(result => {
                    this.values.push(result);
                    this.closeValueClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.attributeService
                .updateValue(this.selectedValue.attributeValueId, this.selectedValue)
                .subscribe(result => {
                    this.closeValueClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    deleteValueClick() {
        this.translate.get('All related articles of this attribute value will be deleted. Are you sure to delete this attribute value?')
            .subscribe((res: string) => this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.attributeService
                    .deleteValue(this.selectedValue.attributeValueId)
                    .subscribe(result => {
                        this.values.splice(this.selectedValueIndex, 1);
                        this.totalValues--;
                        this.closeValueClick();
                    }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }
}
