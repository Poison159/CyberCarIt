import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {Storage} from '@ionic/storage';
@Component({
  selector: 'app-log-mod',
  templateUrl: './log-mod.page.html',
  styleUrls: ['./log-mod.page.scss'],
})
export class LogModPage implements OnInit {

  constructor(public modalController: ModalController, private storage: Storage, private router: Router) { }

  ngOnInit() {
  }
  dismiss(){
    this.dms();
  }

  dms() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  LogOut() {
    this.storage.clear();
    this.dms();
    this.router.navigate(['landing']);
  }
}
