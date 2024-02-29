export default interface IMembership {
  _id: string;
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
}
