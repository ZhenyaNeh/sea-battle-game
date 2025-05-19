import React, { useCallback, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FriendsList from './FriendsList';
import { TypeOfFriendList } from '@/lib/emum';
import { debounce } from 'lodash';

interface FriendTabsProps {
  initialFriendState?: 'friends' | 'search' | 'request';
}

function FriendTabs({ initialFriendState }: FriendTabsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length > 0) {
        setActiveSearch(true);
      } else {
        setActiveSearch(false);
      }
    }, 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    debouncedSearch('');
    setActiveSearch(false);
  };

  return (
    <div className="w-full flex justify-start items-center flex-wrap mb-10">
      <h2 className="text-2xl mb-5 font-bold text-left w-full">Friends</h2>
      <Tabs
        defaultValue={initialFriendState ? initialFriendState : 'friends'}
        className="w-full"
      >
        <TabsList className="w-[300px] grid grid-cols-3">
          <TabsTrigger value="friends" className="text-1xl">
            Friends
          </TabsTrigger>
          <TabsTrigger
            onClick={handleSearchClear}
            value="search"
            className="text-1xl"
          >
            Search
          </TabsTrigger>
          <TabsTrigger value="request" className="text-1xl">
            Requests
          </TabsTrigger>
        </TabsList>
        <TabsContent value="friends">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Your friends</CardTitle>
              <CardDescription className="text-1xl">
                Here you can find all your friends.
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <FriendsList typeOfList={TypeOfFriendList.friends} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Search for friends</CardTitle>
              <CardDescription className="text-1xl">
                Here you can find new friends.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap justify-start items-center">
                <Label
                  htmlFor="current"
                  className="w-full mb-2 font-medium text-lg"
                >
                  Enter friend name
                </Label>
                <div className="w-full flex mb-3">
                  <Input
                    id="search"
                    type="text"
                    className="w-[300px]"
                    placeholder="Jhon Smit"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              {activeSearch && (
                <FriendsList
                  typeOfList={TypeOfFriendList.search}
                  searchString={searchQuery}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Friend requests</CardTitle>
              <CardDescription className="text-1xl">
                Here you can accept friend requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FriendsList typeOfList={TypeOfFriendList.request} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FriendTabs;
