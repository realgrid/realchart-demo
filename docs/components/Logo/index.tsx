import {
  Anchor,
  Group,
  Image,
  MantineNumberSize,
  Text,
  rem,
} from '@mantine/core';
import { HoverItemInfo } from '@/lib/types';

export const Logo = ({
  iconSize,
  textSize,
  brand,
  showBrandName = false,
}: {
  iconSize: MantineNumberSize;
  textSize: MantineNumberSize;
  brand: HoverItemInfo;
  // true면 lightBOLD 구분 타이틀 표시
  showBrandName?: boolean;
}) => {
  if (!brand) return null;

  const Brand = () => (
    <Group spacing={'md'}>
      {brand.iconFile ? (
        <Image
          alt={brand.shortDesc + ''}
          src={brand.iconFile}
          width={iconSize}
          height={iconSize}
        />
      ) : null}
      <Group spacing={'0'}>
        <Text size={textSize} fw={400} lts={-1}>
          {showBrandName ? brand.nameLight : null}
        </Text>
        <Text size={textSize} fw={700} lts={-1}>
          {showBrandName ? brand.nameBold : null}
        </Text>
      </Group>
    </Group>
  );
  return (
    <>
      {brand.link ? (
        <Anchor
          onClick={() => window.location.href = brand.link}
          component='div'
          underline={false}
          sx={{
            display: 'block',
            color: 'inherit',
            fontSize: 'sm',
            paddingTop: rem(3),
            paddingBottom: rem(3),
          }}
        >
          <Brand />
        </Anchor>
      ) : (
        <Brand />
      )}
    </>
  );
};
