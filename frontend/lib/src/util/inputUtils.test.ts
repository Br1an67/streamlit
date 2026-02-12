/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2026)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { isEnterKeyPressed, rejectOverMaxChars } from "./inputUtils"

describe("rejectOverMaxChars", () => {
  it.each([
    {
      domValue: "any-length-value",
      maxChars: 0,
      label: "maxChars is 0 (unlimited)",
    },
    { domValue: "abc", maxChars: 5, label: "DOM value is within maxChars" },
    {
      domValue: "abc",
      maxChars: 3,
      label: "DOM value length equals maxChars exactly",
    },
  ])(
    "returns false and preserves DOM value when $label",
    ({ domValue, maxChars }) => {
      const input = document.createElement("input")
      input.value = domValue

      expect(rejectOverMaxChars(input, domValue, "", maxChars)).toBe(false)
      expect(input).toHaveValue(domValue)
    }
  )

  it("returns true and restores fallback when DOM value exceeds maxChars", () => {
    const input = document.createElement("input")
    input.value = "toolong"

    expect(rejectOverMaxChars(input, "toolong", "ok", 3)).toBe(true)
    expect(input).toHaveValue("ok")
  })

  it("returns true without throwing when inputEl is null", () => {
    expect(rejectOverMaxChars(null, "toolong", "ok", 3)).toBe(true)
  })
})

describe("isEnterKeyPressed", () => {
  it.each([
    { key: "Enter", keyCode: 0, expected: true, label: "Enter key" },
    { key: "SomeKey", keyCode: 13, expected: true, label: "keyCode 13" },
    { key: "SomeKey", keyCode: 10, expected: true, label: "keyCode 10" },
    {
      key: "SomeKey",
      keyCode: 9,
      expected: false,
      label: "non-Enter key/code",
    },
  ])("returns $expected for $label", ({ key, keyCode, expected }) => {
    const event = { key, keyCode, nativeEvent: undefined as never }
    expect(isEnterKeyPressed(event)).toBe(expected)
  })
})
