import React from 'react'
import { cn } from '@/lib/utils'
import AnimatedNumber from '../ui/AnimatedNumber'
import CRMTooltip from '../CrmUi/Tooltip'
import { NotionPage } from '@/interfaces/INotion'
import CustomSkeleton from '../CrmUi/CustomSkeleton'
import { SimpleNotionData } from '../Dashboard/Juridico'

interface MiniCardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  className?: string
}


export const MiniCardContainer: React.FC<MiniCardContainerProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex items-center justify-center gap-2 border-b border-stroke pb-5 dark:border-strokedark xl:border-b-0 xl:border-r xl:pb-0", className)} {...props}>
      {children}
    </div>

  )
}

interface MiniCardLabelProps {
  amount: number,
  customSymbol?: string,
  legend: string,
  currency?: boolean,
  isLoading?: boolean
}

export const MiniCardLabel: React.FC<MiniCardLabelProps> = ({
  amount = 0,
  customSymbol,
  legend,
  isLoading,
  currency = false,
}) => {
  return (
    isLoading ? (
      <MiniCardLabelSkeleton />
    ) : (
      
    <div className='flex flex-col align-middle justify-center'>
      <h4 className="mb-0.5 text-xl font-semibold text-black dark:text-white md:text-title-lg flex flex-row justify-center">
      <AnimatedNumber value={amount} isNotCurrency={!currency} />{customSymbol}
      </h4>
      <p className="text-sm font-medium">
        {
          legend
        }
      </p>
    </div>
    )

  );
};

const MiniCardLabelSkeleton: React.FC = () => {
  return (
    <div className='flex flex-col align-middle justify-center min-h-14'>
      <div className="flex flex-row justify-center min-h-7 mb-2">
        <CustomSkeleton type='content' className='h-7 w-20' />
      </div>
      <div className="flex flex-row justify-center min-h-5 ">
        <CustomSkeleton type='content' className="h-5 w-20" />
      </div>
    </div>
  );
};

type DataStatsProps = {
  data: SimpleNotionData[],
  isLoading?: boolean
}


const DataStats: React.FC<DataStatsProps> = ({ data, isLoading }) => {
  return (
    <div className="col-span-12 rounded-md bg-white p-7.5 dark:bg-boxdark">
    {/* <div className="col-span-12 rounded-md bg-white p-7.5 shadow-default dark:bg-boxdark"> */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
        <MiniCardContainer>
          <CRMTooltip text={"Este é o total de ofícios sob sua \n responsabilidade, independente do status."} placement="top">
            <MiniCardLabel isLoading={isLoading} amount={data.length} legend="Total de ofícios" />
          </CRMTooltip>
          <div className="flex items-center gap-1">
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25259 5.87281L4.22834 9.89706L3.16751 8.83623L9.00282 3.00092L14.8381 8.83623L13.7773 9.89705L9.75306 5.87281L9.75306 15.0046L8.25259 15.0046L8.25259 5.87281Z"
                fill="#10B981"
              />
            </svg>
            <span className="text-meta-3">18%</span>
          </div>
        </MiniCardContainer>
        <MiniCardContainer>
          <MiniCardLabel isLoading={isLoading} amount={data.reduce((acc, item) => acc + item.valor_liquido_disponivel, 0)} legend="Valor total" currency />
          {/* <div className="flex items-center gap-1">
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25259 5.87281L4.22834 9.89706L3.16751 8.83623L9.00282 3.00092L14.8381 8.83623L13.7773 9.89705L9.75306 5.87281L9.75306 15.0046L8.25259 15.0046L8.25259 5.87281Z"
                fill="#10B981"
              />
            </svg>
            <span className="text-meta-3">25%</span>
          </div> */}
          </MiniCardContainer>
        <MiniCardContainer>
          <MiniCardLabel amount={54} customSymbol='%' legend="Bounce Rate" />
          <div className="flex items-center gap-1">
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.75302 12.1328L13.7773 8.10856L14.8381 9.16939L9.00279 15.0047L3.16748 9.16939L4.22831 8.10856L8.25256 12.1328V3.00098H9.75302V12.1328Z"
                fill="#F0950C"
              />
            </svg>
            <span className="text-meta-8">7%</span>
          </div>
        </MiniCardContainer>
        <MiniCardContainer className='xl:border-r-0'>
          <div>
            <h4 className="mb-0.5 text-xl font-semibold text-black dark:text-white md:text-title-lg">
              2m 56s
            </h4>
            <p className="text-sm font-medium">Visit Duration</p>
          </div>
          <div className="flex items-center gap-1">
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25259 5.87281L4.22834 9.89706L3.16751 8.83623L9.00282 3.00092L14.8381 8.83623L13.7773 9.89705L9.75306 5.87281L9.75306 15.0046L8.25259 15.0046L8.25259 5.87281Z"
                fill="#10B981"
              />
            </svg>
            <span className="text-meta-3">12%</span>
          </div>
        </MiniCardContainer>
      </div>
    </div>
  );
};

export default DataStats;
