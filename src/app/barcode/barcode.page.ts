import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.page.html',
  styleUrls: ['./barcode.page.scss'],
})
export class BarcodePage implements OnInit {

  private cardNumber: string;
  private url : string;
  private name : string;
  private web : string;
  private card : any;
  private temp : any;

  constructor(private route: ActivatedRoute,
    private barcodeScanner: BarcodeScanner, 
    private router: Router,
    public modalController: ModalController) { 

    this.route.queryParams.subscribe(params => {
      if (params) {
        this.cardNumber = params.value;
        this.card = JSON.parse(params.card);
        this.name = params.name;
        this.web = params.web;
        this.temp = JSON.parse(params.temp);
        this.url = 'https://carditweb.conveyor.cloud/Content/imgs/' + this.cardNumber + '.jpg';
      }
    });
  }
  ngOnInit() {
    this.url = 'https://carditweb.conveyor.cloud/Content/imgs/' + this.cardNumber + '.jpg';
  }

  encodeText(cardNumber: number) {
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,cardNumber).then((encodedData) => {
        alert(encodedData);
      }, (err) => {
          console.log('Error occured : ' + err);
          alert('error encodind');
      });
  }

  goToEdit() {
    if (this.card) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: this.card.Id,
          merchantId: this.card.merchantId,
          userId: this.card.userId,
          CardNumber: this.card.CardNumber,
          name: this.name
        }
      };
      this.router.navigate(['edit-card'], navigationExtras);
    } else {
      alert('card not found');
    }
  }

  async presentModal(cardid: number) {
    const modal = await this.modalController.create({
      component: ModalPagePage,
      componentProps: {
        cardId: cardid,
        temp: this.temp
      }
    });
    return await modal.present();
  }
}
