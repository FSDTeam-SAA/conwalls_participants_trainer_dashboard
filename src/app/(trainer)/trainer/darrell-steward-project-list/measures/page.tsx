import React, { Suspense } from 'react'
import MeasuresPage from './_components/MeasuresPage'

function page() {
  return (
    <Suspense fallback={<div></div>}>
        <MeasuresPage />
    </Suspense>
  )
}

export default page