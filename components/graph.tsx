"use client";

import React, { Suspense, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { renderNode } from "./GraphNode";
import { type Node } from "./types";

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false } // Disable server-side rendering
);

interface Filter {
  財務: boolean;
  內部: boolean;
  市場值: boolean;
  占比: boolean;
  影響: boolean;
  成長率: boolean;
  景氣指數: boolean;
  政策趨勢: boolean;
}

interface PropertyFilters {
  部門?: string;
  值?: string;
  比較基準?: string;
  表現評估?: string;
}

export default function Graph() {
  const [activeFilters, setActiveFilters] = useState<Filter>({
    財務: false,
    內部: false,
    市場值: false,
    占比: false,
    影響: false,
    成長率: false,
    景氣指數: false,
    政策趨勢: false,
  });
  const [propertyFilters, setPropertyFilters] = useState<PropertyFilters>({});
  const [filter, setFilter] = useState<string[]>([]);

  const parseCurrencyValue = (value: string) => {
    if (!value) return 0;
    return parseInt(value.replace(/[$,]/g, ""));
  };

  const allData = {
    nodes: [
      {
        id: "A1",
        name: "營業收入",
        properties: {
          部門: "財務部",
          值: "$5,000,000",
          比較基準: "$4,500,000",
          表現評估: "良好",
          影響: ["銷貨收入", "銷貨成本", "市場需求"],
        },
        type: "指標",
      },
      {
        id: "A2",
        name: "銷貨收入",
        properties: {
          部門: "銷售部",
          值: "$3,000,000",
          比較基準: "$2,800,000",
          表現評估: "良好",
          影響: ["營業收入", "銷售組合", "內銷市場"],
        },
        type: "指標",
      },
      {
        id: "A3",
        name: "銷貨成本",
        properties: {
          部門: "供應鏈部",
          值: "$2,000,000",
          比較基準: "$1,800,000",
          表現評估: "需改善",
          影響: ["營業收入", "原物料價格"],
        },
        type: "指標",
      },
      {
        id: "A4",
        name: "營業費用",
        properties: {
          部門: "財務部",
          值: "$500,000",
          比較基準: "$450,000",
          表現評估: "一般",
          影響: ["經營效能", "技術研發"],
        },
        type: "指標",
      },
      {
        id: "A5",
        name: "原物料",
        properties: {
          部門: "採購部",
          值: "$1,000,000",
          比較基準: "$900,000",
          表現評估: "需改善",
          影響: ["銷貨成本", "原物料價格", "原物料走勢"],
        },
        type: "因素",
      },
      {
        id: "A6",
        name: "原物料價格",
        properties: {
          部門: "採購部",
          值: "$10/單位",
          比較基準: "$9/單位",
          表現評估: "需改善",
          影響: ["銷貨成本", "原物料", "市場需求"],
        },
        type: "因素",
      },
      {
        id: "A7",
        name: "內銷市場",
        properties: {
          部門: "市場部",
          值: "$2,500,000",
          比較基準: "$2,400,000",
          表現評估: "良好",
          影響: ["銷貨收入", "市場需求"],
        },
        type: "因素",
      },
      {
        id: "A8",
        name: "外銷市場",
        properties: {
          部門: "市場部",
          值: "$1,500,000",
          比較基準: "$1,400,000",
          表現評估: "良好",
          影響: ["銷貨收入", "營業收入"],
        },
        type: "因素",
      },
      {
        id: "A9",
        name: "中美景氣",
        properties: {
          部門: "策略部",
          值: "92.5",
          比較基準: "90.0",
          表現評估: "良好",
          影響: ["外銷市場", "原物料價格"],
        },
        type: "因素",
      },
      {
        id: "A10",
        name: "碳費",
        properties: {
          部門: "合規部",
          值: "$30,000",
          比較基準: "$28,000",
          表現評估: "一般",
          影響: ["銷貨成本", "營業費用"],
        },
        type: "因素",
      },
      {
        id: "B1",
        name: "技術研發",
        properties: {
          部門: "研發部",
          值: "$200,000",
          比較基準: "$180,000",
          表現評估: "良好",
          影響: ["經營效能", "銷售組合"],
        },
        type: "因素",
      },
      {
        id: "B2",
        name: "市場需求",
        properties: {
          部門: "市場部",
          值: "$4,000,000",
          比較基準: "$3,600,000",
          表現評估: "良好",
          影響: ["營業收入", "原物料價格"],
        },
        type: "因素",
      },
      {
        id: "B3",
        name: "銷售組合",
        properties: {
          部門: "銷售部",
          值: null,
          比較基準: null,
          表現評估: "良好",
          影響: ["銷貨收入", "市場需求"],
        },
        type: "策略",
      },
      {
        id: "B4",
        name: "經營效能",
        properties: {
          部門: "管理部",
          值: "85/100",
          比較基準: "80/100",
          表現評估: "良好",
          影響: ["營業費用"],
        },
        type: "策略",
      },
      {
        id: "B5",
        name: "品牌影響力",
        properties: {
          部門: "市場部",
          值: null,
          比較基準: null,
          表現評估: "良好",
          影響: ["銷貨收入", "市場需求"],
        },
        type: "因素",
      },
      {
        id: "B6",
        name: "物流效率",
        properties: {
          部門: "供應鏈部",
          值: "90%",
          比較基準: "85%",
          表現評估: "良好",
          影響: ["銷貨成本", "市場需求"],
        },
        type: "策略",
      },
      {
        id: "B7",
        name: "產品開發速度",
        properties: {
          部門: "研發部",
          值: "6個月",
          比較基準: "8個月",
          表現評估: "良好",
          影響: ["銷貨收入", "技術研發"],
        },
        type: "因素",
      },
      {
        id: "B8",
        name: "市場調查",
        properties: {
          部門: "市場部",
          值: "$80,000",
          比較基準: "$75,000",
          表現評估: "一般",
          影響: ["市場需求", "品牌影響力"],
        },
        type: "策略",
      },
      {
        id: "B9",
        name: "廣告投資",
        properties: {
          部門: "市場部",
          值: "$150,000",
          比較基準: "$140,000",
          表現評估: "良好",
          影響: ["銷貨收入", "品牌影響力"],
        },
        type: "策略",
      },
      {
        id: "B10",
        name: "供應鏈風險",
        properties: {
          部門: "供應鏈部",
          值: null,
          比較基準: null,
          表現評估: "需改善",
          影響: ["原物料", "物流效率"],
        },
        type: "因素",
      },
      {
        id: "B11",
        name: "原材料存量",
        properties: {
          部門: "供應鏈部",
          值: "50,000單位",
          比較基準: "45,000單位",
          表現評估: "良好",
          影響: ["原物料價格", "物流效率"],
        },
        type: "因素",
      },
      {
        id: "C1",
        name: "新市場開拓",
        properties: {
          部門: "策略部",
          值: null,
          比較基準: null,
          表現評估: "一般",
          影響: ["外銷市場", "內銷市場"],
        },
        type: "策略",
      },
      {
        id: "C2",
        name: "研發效率",
        properties: {
          部門: "研發部",
          值: "85%",
          比較基準: "80%",
          表現評估: "良好",
          影響: ["技術研發", "產品開發速度"],
        },
        type: "策略",
      },
      {
        id: "C3",
        name: "市場份額",
        properties: {
          部門: "市場部",
          值: "25%",
          比較基準: "20%",
          表現評估: "良好",
          影響: ["品牌影響力", "銷貨收入"],
        },
        type: "因素",
      },
      {
        id: "C4",
        name: "銷售網絡",
        properties: {
          部門: "銷售部",
          值: "$1,200,000",
          比較基準: "$1,000,000",
          表現評估: "良好",
          影響: ["銷貨收入", "市場需求"],
        },
        type: "策略",
      },
      {
        id: "C5",
        name: "運輸成本",
        properties: {
          部門: "供應鏈部",
          值: "$250,000",
          比較基準: "$230,000",
          表現評估: "一般",
          影響: ["物流效率", "銷貨成本"],
        },
        type: "指標",
      },
      {
        id: "C6",
        name: "環保規範",
        properties: {
          部門: "合規部",
          值: null,
          比較基準: null,
          表現評估: "需改善",
          影響: ["碳費", "原物料"],
        },
        type: "因素",
      },
      {
        id: "C7",
        name: "市場預測",
        properties: {
          部門: "策略部",
          值: "正增長",
          比較基準: "穩定",
          表現評估: "良好",
          影響: ["市場需求", "銷貨收入"],
        },
        type: "策略",
      },
      {
        id: "C8",
        name: "競爭對手分析",
        properties: {
          部門: "市場部",
          值: "$50,000",
          比較基準: "$40,000",
          表現評估: "良好",
          影響: ["品牌影響力", "市場需求"],
        },
        type: "策略",
      },
      {
        id: "C9",
        name: "售後服務成本",
        properties: {
          部門: "銷售部",
          值: "$120,000",
          比較基準: "$110,000",
          表現評估: "一般",
          影響: ["銷貨收入", "市場需求"],
        },
        type: "指標",
      },
      {
        id: "C10",
        name: "數字化轉型",
        properties: {
          部門: "管理部",
          值: "$300,000",
          比較基準: "$250,000",
          表現評估: "良好",
          影響: ["經營效能", "技術研發"],
        },
        type: "策略",
      },
      {
        id: "D1",
        name: "利潤率",
        properties: {
          部門: "財務部",
          值: "18%",
          比較基準: "16%",
          表現評估: "良好",
          影響: ["營業收入", "營業費用"],
        },
        type: "指標",
      },
      {
        id: "D2",
        name: "資金流動性",
        properties: {
          部門: "財務部",
          值: "$800,000",
          比較基準: "$750,000",
          表現評估: "一般",
          影響: ["營業收入", "運輸成本"],
        },
        type: "指標",
      },
      {
        id: "D3",
        name: "企業聲譽",
        properties: {
          部門: "策略部",
          值: null,
          比較基準: null,
          表現評估: "良好",
          影響: ["品牌影響力", "市場份額"],
        },
        type: "因素",
      },
      {
        id: "D4",
        name: "產品多樣性",
        properties: {
          部門: "研發部",
          值: "12個品類",
          比較基準: "10個品類",
          表現評估: "良好",
          影響: ["市場需求", "銷售組合"],
        },
        type: "因素",
      },
      {
        id: "D5",
        name: "客戶滿意度",
        properties: {
          部門: "市場部",
          值: "92%",
          比較基準: "90%",
          表現評估: "良好",
          影響: ["品牌影響力", "銷貨收入"],
        },
        type: "因素",
      },
      {
        id: "D6",
        name: "創新能力",
        properties: {
          部門: "研發部",
          值: "87%",
          比較基準: "85%",
          表現評估: "良好",
          影響: ["技術研發", "產品開發速度"],
        },
        type: "策略",
      },
      {
        id: "D7",
        name: "庫存周轉率",
        properties: {
          部門: "供應鏈部",
          值: "5次/年",
          比較基準: "4次/年",
          表現評估: "良好",
          影響: ["原物料", "運輸成本"],
        },
        type: "指標",
      },
      {
        id: "D8",
        name: "能源效率",
        properties: {
          部門: "合規部",
          值: "80%",
          比較基準: "75%",
          表現評估: "良好",
          影響: ["碳費", "運輸成本"],
        },
        type: "指標",
      },
      {
        id: "D9",
        name: "供應鏈協作",
        properties: {
          部門: "供應鏈部",
          值: null,
          比較基準: null,
          表現評估: "一般",
          影響: ["物流效率", "運輸成本"],
        },
        type: "策略",
      },
      {
        id: "D10",
        name: "風險管理",
        properties: {
          部門: "管理部",
          值: null,
          比較基準: null,
          表現評估: "一般",
          影響: ["經營效能", "資金流動性"],
        },
        type: "策略",
      },
      {
        id: "E1",
        name: "員工生產力",
        properties: {
          部門: "管理部",
          值: "95%",
          比較基準: "90%",
          表現評估: "良好",
          影響: ["經營效能", "運輸成本"],
        },
        type: "指標",
      },
      {
        id: "E2",
        name: "自動化程度",
        properties: {
          部門: "供應鏈部",
          值: "80%",
          比較基準: "75%",
          表現評估: "良好",
          影響: ["物流效率", "運輸成本"],
        },
        type: "策略",
      },
      {
        id: "E3",
        name: "員工流失率",
        properties: {
          部門: "管理部",
          值: "5%",
          比較基準: "7%",
          表現評估: "良好",
          影響: ["經營效能", "員工生產力"],
        },
        type: "指標",
      },
      {
        id: "E4",
        name: "數據分析投資",
        properties: {
          部門: "策略部",
          值: "$400,000",
          比較基準: "$350,000",
          表現評估: "良好",
          影響: ["市場預測", "供應鏈協作"],
        },
        type: "策略",
      },
      {
        id: "E5",
        name: "國際擴展",
        properties: {
          部門: "市場部",
          值: null,
          比較基準: null,
          表現評估: "良好",
          影響: ["外銷市場", "品牌影響力"],
        },
        type: "策略",
      },
      {
        id: "E6",
        name: "市場競爭力",
        properties: {
          部門: "市場部",
          值: "90%",
          比較基準: "85%",
          表現評估: "良好",
          影響: ["市場需求", "銷貨收入"],
        },
        type: "因素",
      },
      {
        id: "E7",
        name: "環保合規率",
        properties: {
          部門: "合規部",
          值: "88%",
          比較基準: "85%",
          表現評估: "良好",
          影響: ["碳費", "��源效率"],
        },
        type: "指標",
      },
      {
        id: "E8",
        name: "生產效率",
        properties: {
          部門: "研發部",
          值: "92%",
          比較基準: "90%",
          表現評估: "良好",
          影響: ["技術研發", "原物料走勢"],
        },
        type: "指標",
      },
      {
        id: "E9",
        name: "客戶留存率",
        properties: {
          部門: "市場部",
          值: "80%",
          比較基準: "75%",
          表現評估: "良好",
          影響: ["銷貨收入", "品牌影響力"],
        },
        type: "指標",
      },
      {
        id: "E10",
        name: "新技術採用率",
        properties: {
          部門: "研發部",
          值: "85%",
          比較基準: "80%",
          表現評估: "良好",
          影響: ["技術研發", "產品開發速度"],
        },
        type: "策略",
      },
      {
        id: "F1",
        name: "財務風險控制",
        properties: {
          部門: "財務部",
          值: "95%",
          比較基準: "90%",
          表現評估: "良好",
          影響: ["資金流動性", "營業收入"],
        },
        type: "指標",
      },
      {
        id: "F2",
        name: "原物料質量",
        properties: {
          部門: "採購部",
          值: "A級",
          比較基準: "B級",
          表現評估: "良好",
          影響: ["原物料價格", "市場需求"],
        },
        type: "因素",
      },
      {
        id: "F3",
        name: "區域物流網絡",
        properties: {
          部門: "供應鏈部",
          值: "$500,000",
          比較基準: "$450,000",
          表現評估: "一般",
          影響: ["物流效率", "運輸成本"],
        },
        type: "策略",
      },
      {
        id: "F4",
        name: "區域銷售增長",
        properties: {
          部門: "銷售部",
          值: "$1,200,000",
          比較基準: "$1,100,000",
          表現評估: "良好",
          影響: ["銷貨收入", "內銷市場"],
        },
        type: "指標",
      },
      {
        id: "F5",
        name: "競爭策略分析",
        properties: {
          部門: "策略部",
          值: "$300,000",
          比較基準: "$280,000",
          表現評估: "良好",
          影響: ["市場競爭力", "品牌影響力"],
        },
        type: "策略",
      },
      {
        id: "F6",
        name: "全球擴展費用",
        properties: {
          部門: "市場部",
          值: "$800,000",
          比較基準: "$750,000",
          表現評估: "一般",
          影響: ["外銷市場", "品牌影響力"],
        },
        type: "策略",
      },
      {
        id: "F7",
        name: "智能倉儲管理",
        properties: {
          部門: "供應鏈部",
          值: "$350,000",
          比較基準: "$300,000",
          表現評估: "良好",
          影響: ["物流效率", "運輸成本"],
        },
        type: "策略",
      },
      {
        id: "F8",
        name: "內部教育投資",
        properties: {
          部門: "管理部",
          值: "$200,000",
          比較基準: "$180,000",
          表現評估: "良好",
          影響: ["員工生產力", "員工流失率"],
        },
        type: "策略",
      },
      {
        id: "F9",
        name: "市場價格彈性",
        properties: {
          部門: "市場部",
          值: "5%",
          比較基準: "4%",
          表現評估: "一般",
          影響: ["銷貨收入", "市場需求"],
        },
        type: "指標",
      },
      {
        id: "F10",
        name: "技術投資回報率",
        properties: {
          部門: "研發部",
          值: "20%",
          比較基準: "18%",
          表現評估: "良好",
          影響: ["技術研發", "新技術採用率"],
        },
        type: "指標",
      },
    ],
  };

  const filteredData = useMemo(() => {
    if (!Object.values(propertyFilters).some(Boolean)) {
      return { nodes: [], links: [] };
    }

    // Filter nodes based on property filters
    const filteredNodes = allData.nodes.filter((node) => {
      return Object.entries(propertyFilters).every(([key, value]) => {
        if (
          !node.properties ||
          !node.properties[key as keyof typeof node.properties]
        ) {
          return false;
        }

        if (key === "值" || key === "比較基準") {
          const nodeValue = parseCurrencyValue(
            node.properties[key as keyof typeof node.properties] as string
          );
          if (value === ">500000") {
            return nodeValue > 500000;
          }
          if (value === "<500000") {
            return nodeValue < 500000;
          }
        }

        return node.properties[key as keyof typeof node.properties] === value;
      });
    });

    // Create links between filtered nodes
    let links = new Set<string>();

    for (let i = 0; i < filteredNodes.length; i++) {
      for (let j = i + 1; j < filteredNodes.length; j++) {
        const node1 = filteredNodes[i];
        const node2 = filteredNodes[j];

        // Check if nodes share any properties from the active filters
        const hasCommonProperty = Object.keys(propertyFilters).some((key) => {
          if (key === "值") {
            const value1 = parseCurrencyValue(node1.properties?.值 || "0");
            const value2 = parseCurrencyValue(node2.properties?.值 || "0");
            const filterValue = propertyFilters.值;

            if (filterValue === ">500000") {
              return value1 > 500000 && value2 > 500000;
            }
            return value1 < 500000 && value2 < 500000;
          }

          return (
            node1.properties?.[key as keyof typeof node1.properties] ===
            node2.properties?.[key as keyof typeof node2.properties]
          );
        });

        if (hasCommonProperty) {
          links.add(JSON.stringify({ source: node1.id, target: node2.id }));
        }
      }
    }

    return {
      nodes: filteredNodes,
      links: Array.from(links).map((link) => JSON.parse(link)),
    };
  }, [propertyFilters]);

  // Get unique values for each property
  const propertyValues = useMemo(() => {
    const values = {
      部門: new Set<string>(),
      值: new Set<string>(),
      比較基準: new Set<string>(),
      表現評估: new Set<string>(),
    };

    allData.nodes.forEach((node) => {
      if (node.properties) {
        values.部門.add(node.properties.部門);
        if (node.properties.值) values.值.add(node.properties.值);
        if (node.properties.比較基準)
          values.比較基準.add(node.properties.比較基準);
        if (node.properties.表現評估)
          values.表現評估.add(node.properties.表現評估);
      }
    });

    return values;
  }, []);

  // Function to add filter
  const addFilter = (key: string, value: string) => {
    const filterText = `${key}: ${value}`;
    if (!filter.includes(filterText)) {
      setFilter([...filter, filterText]);
    }
    setPropertyFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Function to remove filter
  const removeFilter = (filterToRemove: string) => {
    const [key] = filterToRemove.split(": ");
    setFilter(filter.filter((f) => f !== filterToRemove));
    setPropertyFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key as keyof PropertyFilters];
      return newFilters;
    });
  };

  return (
    <Card className="w-full h-screen">
      <div className="flex flex-wrap gap-2 justify-center mb-6 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">部門</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Array.from(propertyValues.部門).map((value) => (
              <DropdownMenuItem
                key={value}
                onClick={() => addFilter("部門", value)}
              >
                {value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">值</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => addFilter("值", ">500000")}>
              {">"} $500,000
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addFilter("值", "<500000")}>
              {"<"} $500,000
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">比較基準</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => addFilter("比較基準", ">500000")}>
              {">"} $500,000
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addFilter("比較基準", "<500000")}>
              {"<"} $500,000
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">表現評估</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Array.from(propertyValues.表現評估).map((value) => (
              <DropdownMenuItem
                key={value}
                onClick={() => addFilter("表現評估", value)}
              >
                {value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {Object.keys(propertyFilters).length > 0 && (
          <Button
            variant="destructive"
            onClick={() => {
              setPropertyFilters({});
              setFilter([]);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center items-center mb-4">
        {filter.map((f) => {
          const [key, value] = f.split(": ");
          return (
            <Button
              variant="outline"
              key={f}
              onClick={() => removeFilter(f)}
              className="flex items-center gap-2"
            >
              {f}
              <span className="ml-2 text-xs">×</span>
            </Button>
          );
        })}
      </div>

      <CardContent>
        {Object.keys(propertyFilters).length > 0 ? (
          <div className="w-full h-[600px] relative">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  Loading...
                </div>
              }
            >
              <ForceGraph2D
                graphData={filteredData}
                nodeLabel={(node: Node) =>
                  `${node.name} (${node.properties?.部門 || ""}, ${
                    node.properties?.值 || "N/A"
                  })`
                }
                nodeVal={20}
                nodeCanvasObject={renderNode}
                d3Force="charge"
                d3ForceStrength={-500}
              />
            </Suspense>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[600px] bg-muted rounded-lg">
            <p className="text-muted-foreground">
              Please select a filter to view the graph
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
