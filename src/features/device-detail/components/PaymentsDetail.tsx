import { Dispatch, SetStateAction } from "react"
import { TabsType } from "../Types"
import RecentActivitiesTable from "./RecentActivitiesTable"



interface PaymentDetailProps{
    activeTab:TabsType
      setActiveTab:Dispatch<SetStateAction<TabsType>>
    
}

export default function PaymentDetail({activeTab,setActiveTab}:PaymentDetailProps){
    return <div className=" pt-4">
      <RecentActivitiesTable activeTab={activeTab} setActiveTab={setActiveTab}/>

    </div>
}