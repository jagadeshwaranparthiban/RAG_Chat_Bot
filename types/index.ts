export type Item = {
  id: number;
  name: string;
  description: string;
  price: string;
  count:number;
};

export type ItemCardProps = {
  item: Item;
  handleItemIncrement: (id: number) => void;
  handleItemDecrement: (id: number) => void;
};

export interface CartItem extends Item {
  count:number;
}

export interface prompt {
  prompt: string
  files?: File[] | null
}

export type chatInfo = {
  id: number;
  sender: string;
  files?: File[] | null;
  message: string | null;
}