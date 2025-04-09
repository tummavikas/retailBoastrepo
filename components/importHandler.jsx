import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Scanner from "./Scanner";
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import Tutorial from "./tutorial/tutorial";
import BillingForm from "./BillingForm/Billing";