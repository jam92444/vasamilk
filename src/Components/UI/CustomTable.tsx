import { Table, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TablePaginationConfig } from "antd/lib";
import "../../Styles/components/_compact-table.scss";

interface CustomTableProps<RecordType> {
  columns: ColumnsType<RecordType>;
  data: RecordType[];
  loading?: boolean;
  pagination: TablePaginationConfig;
  rowKey: string | ((record: RecordType) => string);
  onChange?: (pagination: TablePaginationConfig) => void;
  size?: "small" | "middle" | "large";
  scrollX?: string | number | true;
  emptyText?: string;
  className?: string;
}

const CustomTable = <RecordType extends object>({
  columns,
  data,
  loading = false,
  pagination,
  rowKey,
  onChange,
  size = "small",
  scrollX = true,
  emptyText = "No data found",
  className,
}: CustomTableProps<RecordType>) => {
  const scroll: { x?: string | number | true } = {};
  if (scrollX) {
    scroll.x = scrollX === true ? "max-content" : scrollX;
  }

  return (
    <Spin spinning={loading}>
      <Table
        className={`${className}  compact-table`}
        columns={columns}
        dataSource={data}
        rowKey={rowKey}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          style: { marginTop: 16, textAlign: "center" },
        }}
        onChange={onChange}
        size={size}
        scroll={scroll}
        locale={{ emptyText }}
      />
    </Spin>
  );
};

export default CustomTable;
