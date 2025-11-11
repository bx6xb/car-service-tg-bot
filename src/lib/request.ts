import { Request } from '../api';

export const getEngineText = (engine: string) => {
  return engine === 'petrol' ? 'Бензин' : 'Дизель';
};

export const getDeliveryText = (delivery: string) => {
  return delivery === 'delivery' ? 'С доставкой и установкой' : 'Самовывоз';
};

export const getSource = (source: Request['source']) => {
  switch (source) {
    case 'tg':
      return 'Телеграм';
    case 'website':
      return 'Сайт';
    default:
      return 'Сайт';
  }
};
