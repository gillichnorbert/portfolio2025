import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private content = new Subject()
  public langSign="hu"
  errorMessages: any = {};
  constructor(private http:HttpClient) { 
    this.loadContent()
  }

  changeLanguage(langSign:any){
    this.langSign=langSign
    this.loadContent()
  }

  loadContent(){
    this.http.get("/assets/lang_"+this.langSign+".json").subscribe(
      (res)=>
        {
          this.content.next(res)
        }
      )
  }

  getContent():Subject<any>{
    return this.content
  }
}
