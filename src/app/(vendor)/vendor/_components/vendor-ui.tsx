import {
  PageHeader,
  StatTile,
  StatusPill,
  Card,
  Panel,
  primaryButton,
  outlineButton,
  fieldInput,
  fieldLabel,
  tableHead,
  type Accent,
} from "@/components/shared/dashboard-ui";

export const VendorPageHeader = (props: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => <PageHeader {...props} description={props.subtitle} />;

export const VendorStatCard = StatTile;
export const StatusBadge = StatusPill;
export { Card, Panel };
export const primaryBtn = primaryButton;
export const outlineBtn = outlineButton;
export const inputClass = fieldInput;
export const labelClass = fieldLabel;
export const tableHeadClass = tableHead;
export type { Accent };
