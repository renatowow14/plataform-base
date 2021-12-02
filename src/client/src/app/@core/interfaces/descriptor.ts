export interface DescriptorFilter {
  valueFilter: string;
  viewValueFilter: any;
}

export interface DescriptorMetadata {
  title: string;
  description: string;
}

export interface DescriptorTypeOrigin {
  sourceService: string;
  typeOfTMS: string;
  url?: string;
  epsg?: string;
}

export interface DescriptorMapCardAttributes {
  column: string;
  label: string;
  columnType: string;
}

export interface DescriptorDownload {
  csv: boolean;
  gpkg: boolean;
  layerTypeName: string;
  raster: boolean;
  shp: boolean;
  loading?:boolean;
}

export interface DescriptorType {
  valueType: string;
  type: string;
  viewValueType: string;
  typeLabel?: string;
  filterLabel?: string;
  regionFilter?: boolean;
  filterHandler?: string;
  filterSelected?: string;
  layerLimits?: boolean;
  download: DescriptorDownload;
  origin: DescriptorTypeOrigin;
  opacity: number;
  visible?: boolean;
  displayMapCardAttributes: DescriptorMapCardAttributes;
  filters?: DescriptorFilter[];
  metadata?: DescriptorMetadata[];
}

export interface DescriptorBaseMap {
  idLayer: string;
  visible: boolean;
  selectedType: string;
  types: DescriptorType[];
  selectedTypeObject?: DescriptorType;
}

export interface DescriptorLimit {
  idLayer: string;
  visible: boolean;
  selectedType: string;
  types: DescriptorType[];
  selectedTypeObject?: DescriptorType;
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
  selectedTypeObject?: DescriptorType;
}

export interface Descriptor {
  groups: DescriptorGroup[];
  basemaps: DescriptorBaseMap[];
  limits: DescriptorLimit[];
}


