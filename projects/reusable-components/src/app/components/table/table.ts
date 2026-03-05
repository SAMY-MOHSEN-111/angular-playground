import {CommonModule, NgComponentOutlet} from "@angular/common";
import {ChangeDetectionStrategy, Component, computed, input, model} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {TTableColumn} from './table.types';

// TODO: fix columns when scrolling
// TODO: infer component inputs
@Component({
  selector: "ui-table",
  standalone: true,
  imports: [CommonModule, NgComponentOutlet, TranslateModule],
  templateUrl: "./table.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T> {
  tableDataRows = input.required<T[]>();
  tableHeaderColumns = input.required<TTableColumn<T>[]>();
  isTableSelectionEnabled = input<boolean>(false);
  selectedRows = model<T[]>([]);
  selectedRowsSet = computed(() => new Set<T>(this.selectedRows()));

  gridTemplateColumns = computed<string>(() => {
    const widths = this.tableHeaderColumns().map(col => col.width || 'minmax(7.5rem, 1fr)');
    if (this.isTableSelectionEnabled()) {
      widths.unshift('3.125rem');
    }
    return widths.join(' ');
  });

  headerClassesMap = computed(() => {
    const map = new Map<string, string>();
    for (const header of this.tableHeaderColumns()) {
      map.set(header.id, this.#buildHeaderClasses(header));
    }
    return map;
  });


  isAllSelected = computed(() => {
    const selectedCount = this.selectedRows().length;
    const rowCount = this.tableDataRows().length;
    return rowCount > 0 && selectedCount === rowCount;
  });

  isIndeterminate = computed(() => {
    const selectedCount = this.selectedRows().length;
    return selectedCount > 0 && selectedCount < this.tableDataRows().length;
  });

  toggleAllRows(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedRows.set([...this.tableDataRows()]);
    } else {
      this.selectedRows.set([]);
    }
  }

  toggleRow(row: T, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentSelected = this.selectedRows();

    if (isChecked) {
      this.selectedRows.set([...currentSelected, row]);
    } else {
      this.selectedRows.set(currentSelected.filter(r => r !== row));
    }
  }

  #buildHeaderClasses(header: TTableColumn<T>): string {
    const base = 'px-4 py-3 flex items-center';
    const alignment = this.#getAlignmentClass(header.align);
    return `${base} ${alignment} ${header.appliedClasses ?? ''}`.trim();
  }

  #getAlignmentClass(align?: string): string {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return '';
    }
  }
}
