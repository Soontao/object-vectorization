namespace test;

using {
  cuid,
  managed
} from '@sap/cds/common';


entity Person : cuid, managed {
  Name        : String(255);
  BirthDay    : Date;
  Age         : Integer;
  Status      : String(2);
  region      : Association to one Region;
  inventories : Composition of many Inventory;
}


entity Region : cuid, managed {
  Name : String(255);
}

entity Inventory : cuid, managed {
  Price      : Decimal;
  ExternalID : String(255);
  Producer   : String(255);
  invType    : Association to one InventoryType;
}


entity InventoryType : cuid, managed {
  Name : String(255)
}


annotate Person with {
  ID          @cds.vector.key;
  Name        @cds.vector.type: 'text'; // TODO: to be supported
  BirthDay    @cds.vector.type: 'date';
  Age         @cds.vector.type: 'numeric';
  Status      @cds.vector.type: 'category';
  region      @cds.vector.type: 'category';
  inventories @cds.vector.type: 'unfold';
};


annotate Region with {
  Name @cds.vector.key;
};

annotate Inventory with {
  ID      @cds.vector.key;
  Price   @cds.vector.type: 'numeric';
  invType @cds.vector.type: 'category'
};

annotate InventoryType with {
  Name @cds.vector.key;
}
