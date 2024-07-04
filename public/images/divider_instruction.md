O svg divider precisa da seguinte classe CSS para alcançar o efeito desejado:

```css
.mask {
    color: var(--bg);
    filter: drop-shadow(0 -2px 0 var(--separator-color));
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 75px;
}
```

Em termos de código TSX, a implementação seria a seguinte:

```TSX
import Image from 'next/image';


export default function DividerInstructionExample() {
    return (
        <div className="mask">
            <Image
                src="/images/divider.svg"
                alt="Divider"
                width={"100%"}
                height={75}
            />
        </div>
    );
}
```