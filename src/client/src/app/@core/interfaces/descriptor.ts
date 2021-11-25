export interface DescriptorFilter {
  valueFilter: string;
  viewValueFilter: any;
}

export interface DescriptorMetadata {
  title: string;
  description: string;
}

export interface DescriptorType {
  valueType: string;
  type: string;
  viewValueType: string;
  typeLabel?: string;
  filterLabel?: string;
  regionFilter?: boolean;
  downloadSHP?: boolean;
  downloadCSV?: boolean;
  downloadGPKG?: boolean;
  downloadRaster?: boolean;
  filterHandler?: string;
  filterSelected?: string;
  layerLimits?: boolean;
  opacity: number;
  visible?: boolean;
  filters?: DescriptorFilter[];
  metadata?: DescriptorMetadata[];
}

export interface DescriptorBaseMap {
  idLayer: string;
  visible: boolean;
  selectedType: string;
  types: DescriptorType[];
  type?: DescriptorType;
}

export interface DescriptorLimit {
  idLayer: string;
  visible: boolean;
  selectedType: string;
  types: DescriptorType[];
  type?: DescriptorType;
}

export interface DescriptorGroup {
  idGroup: string;
  labelGroup: string;
  groupExpanded: boolean;
  layers: DescriptorLayer[];
}

export interface DescriptorLayer {
  idLayer: string;
  labelLayer: string;
  visible: boolean;
  selectedType: string;
  types: DescriptorType[];
  type?: DescriptorType;
}

export interface Descriptor {
  groups: DescriptorGroup[];
  basemaps: DescriptorBaseMap[];
  limits: DescriptorLimit[];
}


