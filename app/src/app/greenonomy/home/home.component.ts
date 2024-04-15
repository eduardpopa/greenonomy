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
import { IItem, IMarket } from '../greenonomy.models';
import { environment } from '../../../environment/environment';

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
  providers: [GreenonomyService],
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

  marketItems: IItem[];
  myItems: IItem[];
  constructor(private greenonomyService: GreenonomyService) {}
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
      console.log('Market items: ', items);
      console.log('My items: ', myItems);
      this.marketItems = items;
      this.myItems = myItems;
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
