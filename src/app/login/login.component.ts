import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SessionService } from './../services/session.service';
import { Login } from './../shared/models';

@Component({
    selector: 'app-login-component',
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    userform: FormGroup;

    constructor(
        private messageService: MessageService,
        private sessionService: SessionService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.setTitle('Authentication');
        this.userform = this.fb.group({
            'username': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.required)
        });
    }

    onSubmit(user: Login) {
        this.sessionService.login(user)
            .subscribe(result => {
                this.sessionService.grantCredentials(user.username, result);
            }, 
            error => this.messageService.add({ severity: 'error', summary: '', detail: JSON.stringify(error) })
        );
    }
}
