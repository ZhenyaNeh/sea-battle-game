interface SymbolCellProps {
  symbol: string;
}

const SymbolCell = ({ symbol }: SymbolCellProps) => {
  return (
    <div className="w-10 h-10 flex font-bold text-foreground justify-center items-center">
      {symbol}
    </div>
  );
};

export default SymbolCell;
