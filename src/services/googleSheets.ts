import Papa from 'papaparse';

const SHEET_ID = '1V1teHjeNuLmCfoM-59QmknSYJXuVEDV0BebCdZkhPOc';

export interface SheetDish {
  categoría: string;
  'nombre del plato': string;
  descripción: string;
  precio: string;
  'URL de imagen': string;
}

export interface SheetCategory {
  nombre: string;
}

export const fetchSheetData = async <T>(sheetName: string): Promise<T[]> => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data as T[]),
        error: (error: any) => reject(error),
      });
    });
  } catch (error) {
    console.error(`Error fetching sheet ${sheetName}:`, error);
    return [];
  }
};
