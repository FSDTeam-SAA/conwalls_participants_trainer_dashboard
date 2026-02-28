import React, { Suspense } from 'react'
import TimeTable from './_components/TimeTable'

function page() {
  return (
    <Suspense fallback={<div></div>}>
        <TimeTable />
    </Suspense>
  )
}

export default page