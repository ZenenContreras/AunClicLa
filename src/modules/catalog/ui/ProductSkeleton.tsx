import React from 'react';

const ProductSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
    <div className="aspect-square bg-gray-200 rounded-lg" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-3 bg-gray-100 rounded w-1/2" />
    <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
  </div>
);

export default ProductSkeleton;
