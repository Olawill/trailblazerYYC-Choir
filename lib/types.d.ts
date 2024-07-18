type LoginButtonProp = {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
};

type CardWrapperProp = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

type HeaderProp = {
  label?: string;
};

type BackButtonProp = {
  label: string;
  href: string;
};

type FormErrorProp = {
  message?: string;
  forPage?: boolean;
};

type FormSuccessProp = FormErrorProp;

type MemberData = {
  id: string;
  name: string;
  email: string | undefined;
  status: string;
  amount_paid: number;
  amount_owing: number;
  joined_since: Date;
};
