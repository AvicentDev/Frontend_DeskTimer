import { useState, useEffect } from 'react';

export default function useSelection(items, keyField = 'id') {
  const [selectedItems, setSelectedItems] = useState([]);

  // Maneja la selección/deselección de un ítem
  const handleSelectItem = (itemKey) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemKey)) {
        return prevSelected.filter((key) => key !== itemKey);
      } else {
        return [...prevSelected, itemKey];
      }
    });
  };

  // Maneja el “seleccionar todos”
  const handleSelectAll = (checked) => {
    if (checked) {
      const allKeys = items.map((item) => item[keyField]);
      setSelectedItems(allKeys);
    } else {
      setSelectedItems([]);
    }
  };

  // Limpia la selección
  const clearSelection = () => setSelectedItems([]);

  // Sincroniza la selección cuando los items cambian, eliminando ids que ya no existen
  useEffect(() => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((selectedKey) =>
        items.some((item) => item[keyField] === selectedKey)
      )
    );
  }, [items, keyField]);

  // Determina si todos están seleccionados
  const allSelected = items.length > 0 && selectedItems.length === items.length;

  return {
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    clearSelection,
    allSelected,
  };
}
