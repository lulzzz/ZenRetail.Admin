﻿import { Component, OnInit } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';
import { SessionService } from './../services/session.service';
import { MwsRequest } from './../shared/models';
import { AmazonService } from '../services/amazon.service';

@Component({
    selector: 'app-request-component',
    templateUrl: 'request.component.html'
})

export class RequestComponent implements OnInit {
    totalRecords = 0;
    items: MwsRequest[];
    xml: string;
    cols: any[];

    constructor(private messageService: MessageService,
                private sessionService: SessionService,
                private amazonService: AmazonService) {
        this.cols = [
            { field: 'requestSku', header: 'Sku' },
            { field: 'requestId', header: 'Id' },
            { field: 'requestParentId', header: 'ParentId' },
            { field: 'requestSubmissionId', header: 'SubmissionId' },
            { field: 'requestCreatedAt', header: 'CreatedAt' },
            { field: 'requestSubmittedAt', header: 'SubmittedAt' },
            { field: 'requestCompletedAt', header: 'CompletedAt' },
            { field: 'messagesProcessed', header: 'Process' },
            { field: 'messagesSuccessful', header: 'Success' },
            { field: 'messagesWithWarning', header: 'Warning' },
            { field: 'messagesWithError', header: 'Error' },
            { field: 'requestCompletedAt', header: 'CompletedAt' }
        ]; 
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Amazon requests');
        this.refreshClick();
    }

    refreshClick() {
        this.amazonService
            .get()
            .subscribe(result => {
                this.items = result;
                this.totalRecords = this.items.filter(p => p.requestCompletedAt === 0).length;
            }, onerror => this.messageService.add({severity: 'error', summary: 'Error', detail: onerror._body})
        );
    }

    selectXml(event, xml: string, overlaypanel: OverlayPanel) {
        this.xml = xml;
        overlaypanel.toggle(event);
    }

    // deleteClick(requestSubmissionId: string) {
    //     this.confirmationService.confirm({
    //         message: 'Are you sure that you want to cancel this request?',
    //         accept: () => {
    //             this.amazonService
    //                 .delete(requestSubmissionId)
    //                 .subscribe(result => {
    //                     // this.items.splice(this.selectedIndex, 1);
    //                     this.totalRecords--;
    //                 }, onerror => this.messageService.add({severity: 'error', summary: 'Error', detail: onerror._body}));
    //         }
    //     });
    // }
}
