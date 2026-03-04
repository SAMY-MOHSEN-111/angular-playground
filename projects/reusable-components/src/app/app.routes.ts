import { Routes } from '@angular/router';
import {ButtonsViewComponent} from './views/buttons-view.component';
import {TablesViewComponent} from './views/tables-view.component';

export const routes: Routes = [
  {
    path: "components/buttons",
    component: ButtonsViewComponent
  },
  {
    path: "components/tables",
    component: TablesViewComponent
  }
];
