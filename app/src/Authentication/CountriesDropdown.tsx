import React, { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { Country, countryList } from "@/assets/countryList";
import ReactCountryFlag from "react-country-flag";
import { set } from "lodash";

const countries = Object.values(countryList);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CountriesDropdown: React.FC<{
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
}> = ({ selectedCountry, setSelectedCountry }) => {
  const [query, setQuery] = useState("");
  const [openOptions, setOpenOptions] = useState(false);

  const optionSelected = (e: React.ChangeEvent<HTMLOptionElement>) => {
    setOpenOptions(false);
    setQuery(e.target.innerText);
  };

  const filteredCountries =
    query === ""
      ? countries
      : countries.filter((country) => {
          return country.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={selectedCountry} onChange={setSelectedCountry}>
      <div className="relative mt-2">
        {selectedCountry && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <ReactCountryFlag
              countryCode={selectedCountry.code}
              svg
              style={{
                fontSize: "1.5em",
                lineHeight: "2em",
                borderRadius: "7px",
              }}
            />
          </span>
        )}
        <Combobox.Input
          className="w-full pl-12 rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(country: Country) => country?.name}
          onBlur={() => setOpenOptions(false)}
          onClick={() => setOpenOptions(true)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredCountries.length > 0 && (
          <Combobox.Options
            static={openOptions}
            className="absolute z-10 mt-1 p-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {filteredCountries.map((country) => (
              <Combobox.Option
                onClick={optionSelected}
                key={country.code}
                value={country}
                className={({ active }) =>
                  classNames(
                    "relative cursor-pointer rounded-md select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <span
                        role="img"
                        className="h-7 w-6 flex-shrink-0 select-none"
                      >
                        <ReactCountryFlag
                          countryCode={country.code}
                          svg
                          style={{
                            fontSize: "2em",
                            lineHeight: "2em",
                            borderRadius: "9px",
                          }}
                        />
                      </span>
                      <span
                        className={classNames(
                          "ml-3 truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {country.name}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};
export default CountriesDropdown;
