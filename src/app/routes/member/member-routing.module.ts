import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardholdersVipComponent } from './cardholdersVip/cardholdersVip.component';
import { PotentialVipComponent } from './potentialVip/potentialVip.component';
import { MemberCardDataComponent } from './memberCardData/memberCardData.component';
import { MemberAnalysisComponent } from './memberAnalysis/memberAnalysis.component';
import { CardDataExportComponent } from './cardDataExport/cardDataExport.component';
import { OnlyCardImportComponent } from './onlyCardImport/onlyCardImport.component';
import { ManyCardImportComponent } from './manyCardImport/manyCardImport.component';


const routes: Routes = [
    { path: 'cardholdersVip', component: CardholdersVipComponent },
    { path: 'potentialVip', component: PotentialVipComponent },
    { path: 'memberCardData', component: MemberCardDataComponent }, 
    { path: 'memberAnalysis', component: MemberAnalysisComponent },  
    { path: 'cardDataExport', component: CardDataExportComponent },       
    { path: 'onlyCardImport', component: OnlyCardImportComponent },    
    { path: 'manyCardImport', component: ManyCardImportComponent },    
       
        
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MemberRoutingModule { }