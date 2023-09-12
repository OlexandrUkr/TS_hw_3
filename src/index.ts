class Company {
  public companyName: string;
  private _listDepartments: Department[] = [];
  private _listPreHiredStaffs: PreHiredStaff[] = [];
  private _listStaff: Staff[] = [];

  constructor(companyName: string) {
    this.companyName = companyName;
  }

  get listDepartments(): Department[] {
    return this._listDepartments;
  } 

  get listPreHiredStaffs(): PreHiredStaff[] {
    return this._listPreHiredStaffs;
  }

  get listStaff(): Staff[] {
    return this._listStaff;
  }
}

interface Budget {
  DEBIT: number;
  CREDIT: number;
}

class Department {
  nameDepart: string;
  domainDepart: string;
  departStaff: Staff[] = [];
  budget: Budget;
  balance: number;

  constructor(nameDepart: string, domainDepart: string, departStaff: [], budget: Budget) {
    this.nameDepart = nameDepart;
    this.domainDepart = domainDepart;
    this.departStaff = departStaff;
    this.budget = budget;
    this.balance = 0;
  }

  private _addSum(sum: number) {
    this.budget.DEBIT += sum;
  }

  private _delSum(sum: number) {
    this.budget.CREDIT += sum;
  }

  addStufFromPreHired(
    preHiredStaff: PreHiredStaff,
    status: StaffStatus,
    departament: Department,
  ): void {
    preHiredStaff.status = status;
    preHiredStaff.department = departament;
    this._delSum(preHiredStaff.paySum);
  }

  delStuffFromDep(staff: Staff): void {
    staff.department = null;
    staff.status = StaffStatus.INACTIVE;
    this._addSum(staff.paySum);
  }

  calculateBalance(): number {
    return this.budget.DEBIT + this.budget.CREDIT;
  }

  addStuff(staff: Staff): void {
    this.departStaff = [...this.departStaff, staff];
  }

  addPreHiredStaff(preHiredStaff: PreHiredStaff): void {
    this.departStaff = [...this.departStaff, preHiredStaff];
  }
}

enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  FREEVACATION = 'FREEVACATION',
}

class Staff {
  nameStaff: string;
  surnameStaff: string;
  payInformation: string;
  paySum: number;
  status: StaffStatus | null;
  department: Department | null;

  constructor(
    nameStaff: string,
    surnameStaff: string,
    payInformation: string,
    paySum: number,
    status: StaffStatus | null,
    department: Department | null,
  ) {
    this.nameStaff = nameStaff;
    this.surnameStaff = surnameStaff;
    this.payInformation = payInformation;
    this.paySum = paySum;
    this.status = status;
    this.department = department;
  }
}

class PreHiredStaff extends Staff{
  constructor(
    nameStaff: string,
    surnameStaff: string,
    payInformation: string,
    paySum: number,
    status: null,
    department: null,
  ) {
    super(
      nameStaff,
      surnameStaff,
      payInformation,
      paySum,
      status,
      department);
  }
}

class AccountingDepart extends Department {
  addTo(add: Staff | Department): void{
    if (add instanceof Staff) {
      add.status = StaffStatus.ACTIVE;
    } else if (add instanceof Department) {
      let i: number = 0;
      while(i < add.departStaff.length) {
        add.departStaff[i].status = StaffStatus.ACTIVE;
        i += 1; 
      }
    }
  }

  delFrom(del: Staff | Department): void{
    if (del instanceof Staff) {
      del.status = StaffStatus.INACTIVE;
    } else if (del instanceof Department) {
      let i: number = 0;
      while(i < del.departStaff.length) {
        del.departStaff[i].status = StaffStatus.INACTIVE;
        i += 1; 
      }
    }
  }

  private _payInner(payData: Staff): void {
    this.budget.CREDIT += payData.paySum;
  }

  private _payOut(payData: PreHiredStaff): void {
    this.budget.CREDIT += payData.paySum;
  }
  
  paySalary(account: Staff | Department | PreHiredStaff): void {
    if (account instanceof Staff && account.status === StaffStatus.ACTIVE) {
      this._payInner(account);
    } else if (account instanceof Department) {
      let i: number = 0;
      while(i < account.departStaff.length) {
        this._payInner(account.departStaff[i]);
        i += 1; 
      }
    } else if (account instanceof PreHiredStaff) {
      this._payOut(account);
    }
  }
}
