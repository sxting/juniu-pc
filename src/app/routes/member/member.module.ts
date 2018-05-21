import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

import { MemberRoutingModule } from './member-routing.module';
import { MemberService } from './shared/member.service';
import { CardholdersVipComponent } from './cardholdersVip/cardholdersVip.component';
import { PotentialVipComponent } from './potentialVip/potentialVip.component';
import { MemberCardDataComponent } from './memberCardData/memberCardData.component';
import { MemberAnalysisComponent } from './memberAnalysis/memberAnalysis.component';
import { CardDataExportComponent } from './cardDataExport/cardDataExport.component';
import { OnlyCardImportComponent } from './onlyCardImport/onlyCardImport.component';
import { ManyCardImportComponent } from './manyCardImport/manyCardImport.component';

@NgModule({
    imports: [SharedModule, MemberRoutingModule],
    declarations: [
        CardholdersVipComponent,
        PotentialVipComponent,
        MemberCardDataComponent,
        MemberAnalysisComponent,
        CardDataExportComponent,
        OnlyCardImportComponent,
        ManyCardImportComponent
    ],
    providers: [MemberService]
})
export class MemberModule {
}
