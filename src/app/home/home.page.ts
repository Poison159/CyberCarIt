import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { CardService } from '../services/CardService';
import {Storage} from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LogModPage } from '../log-mod/log-mod.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private email: string;
  public imgUrl = '../../assets/images/icon.png';
  private temp: any;
  private user: any;
  public tempCard: any;
  public cards = new Array<any>();
  public merchants = new Array<any>();
  private backButtonSubscription: any;
  constructor(private router: Router,
              public modalController: ModalController,
              private cardService: CardService,
              public loadingController: LoadingController,
              private storage: Storage,
              public route: ActivatedRoute,
              private barcodeScanner: BarcodeScanner,
              public toastController: ToastController,
              public platform: Platform) {
      this.route.queryParams.subscribe(params => {
        if (params && params.token) {
          this.temp = JSON.parse(params.token);
          this.user = this.temp._user;
        }
        if(params && params.card){
          let card = JSON.parse(params.card);
          let merchant = JSON.parse(params.merchant);
          if(this.cards[0].Id !== card.Id){
            this.merchants.unshift(merchant);
            this.cards.unshift(card);
          }
        }
        if(params && params.cardId){
          this.merchants = this.merchants.filter(x => x.Id != params.merchId);
          this.cards = this.cards.filter(x => x.Id != params.cardId);
        }
        if(params && params.newCard){
          this.tempCard =  JSON.parse(params.newCard);
          this.cards.filter(x => x.Id == this.tempCard.Id)[0].CardNumber = this.tempCard.CardNumber;
        }
      });
    }

  // tslint:disable-next-line:use-lifecycle-interface
  async ngOnInit() {
    if(this.temp){
      this.user = this.temp._user;
      this.getCardsAndShowLoading();
    }else{
      this.storage.get('ct-token').then(token => {
        this.user = token._user;
        this.getCardsAndShowLoading();
      });
    }
  }

  async getCardsAndShowLoading() {
    if(this.temp){
      this.user = this.temp._user;
    }
    if (this.user) {
      const loading = await this.loadingController.create({
        message: 'Fetching cards...',
        duration: 5000
      });
      loading.present();
      this.cardService.getCards(this.user.Id).subscribe(res => {
        this.cards = res.Cards;
        this.merchants = res.Merchants;
        loading.dismiss();
      }, async error => {
        const toast = await this.toastController.create({
          message: 'no cards found ❌',
          duration: 2000,
          position: 'middle'
        });
        toast.present();
        loading.dismiss();
      }, () => {
        loading.dismiss();
      });
    } else {
      const toast = await this.toastController.create({
        message: 'no cards found ❌',
        duration: 2000,
        position: 'middle'
      });
      toast.present();
    }
  }

  ionViewWillEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
    navigator['app'].exitApp();
    });
  }

  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }

  async clearCards() {
    const modal = await this.modalController.create({
      component: LogModPage,
    });
    return await modal.present();
  }

  encode(cardId: number,merchName:string,merchWeb:string){
    let card = this.cards.find(x => x.Id == cardId);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        value : card.CardNumber,
        name : merchName,
        web: merchWeb,
        card: JSON.stringify(card),
        temp: JSON.stringify(this.temp)
      }
    }
    this.router.navigate(['barcode'],navigationExtras);
  }

  addCard() {
    if(this.temp){
      const navigationExtras: NavigationExtras = {
        queryParams: {
          token: JSON.stringify(this.temp)
        }
      };
      this.router.navigate(['add-card'],navigationExtras);
    }else{
      this.router.navigate(['add-card']);
    }
  }

  

  doRefresh(event) {
    this.getCardsAndShowLoading();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
}
