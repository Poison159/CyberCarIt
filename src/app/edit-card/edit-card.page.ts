import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/CardService';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.page.html',
  styleUrls: ['./edit-card.page.scss'],
})
export class EditCardPage implements OnInit {
  private id: number;
  private CardNumber: string;
  private name: string;
  private merchantId: number;
  private userId:number; 

  constructor(private cardService: CardService, 
    private loadingContoller: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.id= params.id;
          this.userId= params.userId;
          this.name = params.name;
          this.merchantId= params.merchantId;
          this.CardNumber= JSON.parse(params.CardNumber);
        }
      });

     }
  ngOnInit() {
  }

  async edit(){
      if(this.CardNumber == ""){
        const toast = await this.toastController.create({
          message: "please add card number",
          duration: 2000,
          position: 'middle'
        });
        toast.present();
      }else{
      const loading = await this.loadingContoller.create({
        message: 'editing card ...',
        duration: 5000
      });
      this.cardService.editCard(this.id, this.userId, this.merchantId, this.CardNumber)
      .subscribe(async res => {
          if(this.checkForErrors(res)){
            loading.dismiss();
          const toast = await this.toastController.create({
            message: "Done! Refresh to see change.",
            duration: 2000,
            position: 'middle'
          });
          toast.present();
          this.router.navigate(['home']);
        }else{
          const toast = await this.toastController.create({
            message: res.Errors,
            duration: 2000,
            position: 'middle'
          });
          toast.present();
          loading.dismiss();
        }
      }, async error => {
        const toast = await this.toastController.create({
          message: "can't edit card",
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
  checkForErrors(res: any){
    if(res.Errors){
      return false;
    }else{
      return true;
    }
  }
}
