import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../src/components/common/ErrorMessage";

describe('component', ()=>{
    test('ErrorMessage : the message container should be a div element', ()=>{
        render(<ErrorMessage message=""/>);
        const message = screen.getByTestId('message')
        expect(message.nodeName).toBe('DIV')
    })
})