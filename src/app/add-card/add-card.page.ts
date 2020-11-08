import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/CardService';
import { LoadingController, ModalController, Platform, ToastController, ActionSheetController } from '@ionic/angular';
import {Storage} from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Card } from '../Card';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { AlertController } from '@ionic/angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet/ngx';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
})
export class AddCardPage implements OnInit {
  private user : any;
  private temp : any;
  public merchants: any[];
  private card : any;
  private merchant : any; 

  constructor(private cardService: CardService, 
              private loadingCtr: LoadingController, 
              private storage: Storage, 
              private barcodeScanner:BarcodeScanner,
              private router: Router,
              private platform: Platform,
              private alertController : AlertController,
              private loadingContoller: LoadingController,
              public modalController: ModalController,
              public toastController: ToastController,
              private actionSheet: ActionSheet,
              private route: ActivatedRoute,
              public actionSheetController: ActionSheetController) {
                this.route.queryParams.subscribe(params => {
                  if (params && params.token) {
                    this.temp = JSON.parse(params.token);
                  }
                });
              }

  async ngOnInit() {
    if(this.temp){
      this.user = this.temp._user;
    }else{
      this.storage.get('ct-token').then(res => {
        this.user = res._user;
      });
    }
    const loading = await this.loadingCtr.create({
      message: 'Fetching merchants'
    });
    loading.present();
    this.cardService.getMerchants().subscribe(res => {
      this.merchants = res;
      loading.dismiss();
    }, async error => {
      const toast = await this.toastController.create({
        message: "can't get merchants 😢",
        duration: 2000,
        position: 'middle'
      });
      toast.present();
      loading.dismiss();
    }, () => {
      loading.dismiss();
    });
  }

  async selectInput(){
    

  }

  async addCard(shopName: string,website: string, imagePath:string) {
    if(this.platform.is("cordova")){

      const actionSheet = await this.actionSheetController.create({
        header: 'Please select input method',
        cssClass: 'my-custom-class',
        buttons: [{
          text: 'Scan',
          icon: 'qr-code-outline',
          handler: () => {
            this.scanInput(shopName, website, imagePath);
          }
        }, {
          text: 'Manual Input',
          icon: 'create-outline',
          handler: () => {
            this.manualInput(shopName, website, imagePath);
          }
        }]
      });
      await actionSheet.present();
    }else{
      this.manualInput(shopName, website, imagePath);
    }
  }

  async scanInput(shopName: string,website: string, imagePath:string){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        card: JSON.stringify(this.card),
        merchant: JSON.stringify(this.merchant),
      }
    };
    this.barcodeScanner.scan().then(barcodeData => {
      this.saveTolocalStorage(shopName,barcodeData.text,website,imagePath);
      this.router.navigate(['home'],navigationExtras);
    }).catch(err => {
        alert(err);
    });
  }

  async manualInput(shopName: string,website: string, imagePath:string){
    const alert = await this.alertController.create({
      header: 'Add card',
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: 'card number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            this.saveTolocalStorage(shopName,alertData.code,website,imagePath);
            
          }
        }
      ]
    });
    await alert.present();
  }

  async saveTolocalStorage(shopName: string, cardNumber: string, website:string, imagePath: string) {
    if(cardNumber == ""){
      const toast = await this.toastController.create({
        message: "please add card number ⛔",
        duration: 2000,
        position: 'middle'
      });
      toast.present();
    }else{
      const loading = await this.loadingContoller.create({
        message: 'adding card...',
        duration: 5000
        });
        loading.present();
    
      this.cardService.saveCard(shopName,cardNumber,this.user.Id)
        .subscribe(async (cardRes) => {
          if(this.checkRes(cardRes)){
            this.card = cardRes.card;
            this.merchant = cardRes.merchant;
            loading.dismiss();
            const toast = await this.toastController.create({
              message: "card added ✅",
              duration: 2000,
              position: 'middle',
              
            });
            toast.present();
            const navigationExtras: NavigationExtras = {
              queryParams: {
                card: JSON.stringify(this.card),
                merchant: JSON.stringify(this.merchant),
              }
            };
            this.router.navigate(['home'], navigationExtras);
          }else{
            const toast = await this.toastController.create({
              message: cardRes.Errors +" 😢",
              duration: 3000,
              position: 'middle'
            });
            toast.present();
            loading.dismiss();
          }
          
        }, async error => {
          const toast = await this.toastController.create({
            message: "Can't add card. Please make sure card number or barcode is correct ❌",
            duration: 3000
          });
          toast.present();
          loading.dismiss();
        }, async () => {
          
        });
    }
    
  }
  checkRes(cardRes: any) {
    if(cardRes.Errors){
      return false;
    }else{
        return true;
    }
  }

  checkIfExists(card: Card, cards: Array<Card>) {
    cards.forEach(element => {
      if (element.cardNumber === card.cardNumber) {
        return true;
      }
    });
    return false;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
