import React from "react";

interface VirtualProps {
  dataSource: any[];
}

const Virtual = ({dataSource}: VirtualProps) => {

  return <div>
    {dataSource.map(data => <div>{data.value}</div>)}
  </div>
}

export default Virtual;