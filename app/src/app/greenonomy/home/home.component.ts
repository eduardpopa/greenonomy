import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgFor, UpperCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  Observable,
  catchError,
  map,
  first,
  of,
  Subscription,
  combineLatest,
} from 'rxjs';
import { GreenonomyService } from '../greenonomy.service';
import { IMarket } from '../greenonomy.models';
import { environment } from '../../../environment/environment';
// import { Web3Service } from '../web3.service';

// declare let require: any;
// const market_artifacts = require('../Market.json');
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    MatExpansionModule,
    MatIconModule,
    MatDividerModule,
    NgFor,
    DatePipe,
    UpperCasePipe,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
  ],
  providers: [
    GreenonomyService,
    // Web3Service
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  marketAddress: string = environment.geenonomy.contractMarketAddress;
  panelOpenState: boolean;
  markets: IMarket[];
  // alumni: Alumn[];
  subscription: Subscription;

  accounts: string[];
  market: any;

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: '',
  };

  status = '';

  constructor(
    private greenonomyService: GreenonomyService // private web3Service: Web3Service
  ) {}
  async ngOnInit(): Promise<void> {
    this.subscription = combineLatest([
      this.greenonomyService.getCurrentBlock(),
      this.greenonomyService.getItemAddress(),
      this.greenonomyService.getGreenomAddress(),
      this.greenonomyService.getMarketItems(),
      this.greenonomyService.getMyItems(),
    ]).subscribe(([block, itemAddress, greenomAddress, items, myItems]) => {
      console.log('Current block: ', block);
      console.log('Item contract address: ', itemAddress);
      console.log('Greenom contract address: ', greenomAddress);
      console.log('Market items count: ', items);
      console.log('My items count: ', myItems);
      // console.log('test', name);
    });
    // this.alumniSub = this.greenonomyService.list().subscribe((data) => {
    //   this.alumni = data;
    // });
    // const res = await this.greenonomyService.connectMetamask();
    // console.log(res);
    // await this.greenonomyService.talkwithcontract();
    // this.greenonomyService
    //   .artifactsToContract(market_artifacts)
    //   .then((instance) => {
    //     this.market = instance;
    //     this.market.deployed().then((deployed) => {
    //       console.log(deployed);
    //       deployed.Transfer({}, (err, ev) => {
    //         console.log('Transfer event came in, refreshing balance');
    //         // this.refreshBalance();
    //       });
    //     });
    //   });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onDelete(id: string) {
    if (
      confirm('Are you sure to delete? [Better UI with Angular Dialog ...]')
    ) {
      // this.greenonomyService
      //   .delete(id)
      //   .pipe(
      //     first(),
      //     catchError((err) => {
      //       console.log('ERROR:', err);
      //       return of(true);
      //     })
      //   )
      //   .subscribe((result) => {
      //     if (result) {
      //       const idx = this.alumni.findIndex((item) => item.id === id);
      //       this.alumni.splice(idx, 1);
      //     }
      //   });
    }
  }
}
