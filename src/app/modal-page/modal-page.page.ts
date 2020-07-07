import { Component, OnInit } from '@angular/core';
import { Card } from '../Card';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import {Storage} from '@ionic/storage';
import { CardService } from '../services/CardService';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {
  cardId: number;
  temp: any;
  cards = new Array<Card>();
  constructor(public modalController: ModalController,
    private storage: Storage,
    public loadingController: LoadingController,
    private cardService: CardService,
    public toastController: ToastController,
    private router: Router ) { }

  ngOnInit() {
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  async delete(cardId:number){ // returned list will be new cards
    const loading = await this.loadingController.create({
      message: 'Removing card...'
    });
    this.getUserandRemoveCard(loading,cardId);
    this.dismiss();
  }

  getUserandRemoveCard(loading: HTMLIonLoadingElement,cardId: number){
    if(this.temp){
      loading.present();
      this.doWork(this.temp._user.Email, loading,cardId);
    }else{
      this.storage.get('ct-token').then((res) => {
        if(res._user){
          loading.present();
          this.doWork(res._user.Email, loading,cardId);
        }else{
          alert('user not found')
        }  
        });
    }
  }
  doWork(email: string, loading: HTMLIonLoadingElement, cardId){
    this.cardService.removeCard(cardId,email).subscribe(async res => {
      const toast = await this.toastController.create({
        message: "Card removed!",
        duration: 2000,
        position: 'middle'
      });
      loading.dismiss();
      toast.present();
      const navigationExtras: NavigationExtras = {
        queryParams: {
          cardId: cardId,
          merchId: res.Id
        }
      };
      this.router.navigate(['home'],navigationExtras);
    },async error => {
      const toast = await this.toastController.create({
        message: "Card can't be removed",
        duration: 2000,
        position: 'middle'
      });
      toast.present();
      loading.dismiss();
    },() => {
      loading.dismiss();
    });
  }

}
