import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { IUser } from '../User';
import { Injectable } from '@angular/core';

@Injectable()
export class CardService {
    private Url                         = 'https://carditweb.conveyor.cloud/'; 
    private localUrl                    = 'https://192.168.8.101:45456/'; 
    private _userRegistration           =  this.Url + 'api/RegisterUser';
    private _userLogin                  =  this.Url + 'api/GetUserLogin';
    private _mechants                   =  this.Url + 'api/Merchants';
    private _addCard                    =  this.Url + 'api/AddCard';
    private _addMerchant                =  this.Url + 'api/AddMerchant'
    private _userUrl                    =  this.Url + 'api/users'
    private _removeCard                 =  this.Url + 'api/cards'
    private _editCard                   =  this.Url + 'api/Edit'
    
    constructor(private _http: HttpClient){}
    getMerchants(){
        console.log('getting merchants ...');
        return this._http.get<any[]>(this._mechants);
    }

    addMerchant(name:string, website:string, ImagePath:string){
        const body = {name: name, website: website, imagePath:ImagePath};
        let header = new HttpHeaders();
        header = header.append('content-type', 'application/json');
        console.log('adding merchant ...');
        return this._http.post<any>(this._addMerchant,JSON.stringify(body),{headers: header});
    }

    editCard(id:number, userId:number, merchantId:number, cardNumber: string){
        console.log('updating card ...');
        return this._http.get<any>(this._editCard + '?id=' + id + '&cardNUmber=' + cardNumber);
    }

    saveCard(merchantName:string, cardNumber:string, userId:number) : Observable<any>{
        console.log('saving Card in ...');
        return this._http.get<any>(this._addCard + '?merchantName=' + merchantName + '&cardNumber=' + cardNumber
                                     + '&userId='+ userId);
    }

    removeCard(cardId:number, email:string) : Observable<any>{
        console.log('Removing Card ...');
        return this._http.delete<any>(this._removeCard + '?id=' + cardId + '&email=' + email);
    }

    getCards(userId: number){
        console.log('getting cards ...');
        return this._http.get<any>(this._userUrl + '?userId=' + userId);
    }
}